<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class MailConfiguration extends Model
{
    private const DAILY_LIMIT = 450;

    protected $fillable = [
        'name',
        'host',
        'port',
        'username',
        'password',
        'encryption',
        'from_address',
        'from_name',
        'is_active',
    ];

    public function setPasswordAttribute(string $value): void
    {
        $normalized = preg_replace('/[^a-zA-Z0-9]/', '', trim($value));
        $this->attributes['password'] = encrypt($normalized ?? '');
    }

    public function getPasswordAttribute(string $value): string
    {
        return decrypt($value);
    }

    public static function getActive(): self
    {
        return static::where('is_active', true)->firstOrFail();
    }

    public static function applyToMailer(self $config): void
    {
        config([
            'mail.default' => 'smtp',
            'mail.mailers.smtp.host' => $config->host,
            'mail.mailers.smtp.port' => $config->port,
            'mail.mailers.smtp.username' => $config->username,
            'mail.mailers.smtp.password' => $config->password,
            'mail.mailers.smtp.encryption' => $config->encryption,
            'mail.from.address' => $config->from_address,
            'mail.from.name' => $config->from_name,
        ]);

        app('mail.manager')->purge('smtp');
    }

    /** @return HasOne<EmailQuota, $this> */
    public function emailQuota(): HasOne
    {
        return $this->hasOne(EmailQuota::class, 'mail_configuration_id')
            ->where('quota_date', today());
    }

    /** @return HasMany<EmailQuota, $this> */
    public function quotas(): HasMany
    {
        return $this->hasMany(EmailQuota::class, 'mail_configuration_id');
    }

    public function getRemainingQuota(): int
    {
        $quota = $this->emailQuota()->first() ?? $this->initializeQuotaForToday();
        return max(0, (int) $quota->daily_limit - (int) $quota->sent_count);
    }

    public function canSendEmail(): bool
    {
        return $this->getRemainingQuota() > 0;
    }

    public function incrementSentCount(): void
    {
        $quota = $this->emailQuota()->first() ?? $this->initializeQuotaForToday();
        $quota->increment('sent_count');
    }

    private function initializeQuotaForToday(): EmailQuota
    {
        return EmailQuota::firstOrCreate(
            [
                'mail_configuration_id' => $this->id,
                'quota_date' => today()->toDateString(),
            ],
            [
                'sent_count' => 0,
                'daily_limit' => self::DAILY_LIMIT,
            ]
        );
    }

    public function getTodayQuota(): EmailQuota
    {
        return $this->emailQuota()->first() ?? $this->initializeQuotaForToday();
    }

    public static function getActiveWithQuota(): ?self
    {
        return static::query()
            ->orderByDesc('is_active')
            ->orderBy('id')
            ->get()
            ->first(static fn(self $config): bool => $config->canSendEmail());
    }
}
