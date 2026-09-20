<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UpdatePasswordTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_update_their_password(): void
    {
        $user = User::factory()->create(['password' => 'old-password']);

        $response = $this->actingAs($user)->put(route('password.update'), [
            'current_password' => 'old-password',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

        $response->assertRedirect(route('profile.edit'));
        $response->assertSessionHas('status', 'password-updated');
        $this->assertTrue(Hash::check('new-password', $user->refresh()->password));
    }

    public function test_current_password_must_match(): void
    {
        $user = User::factory()->create(['password' => 'old-password']);

        $response = $this->actingAs($user)->from(route('profile.edit'))->put(route('password.update'), [
            'current_password' => 'wrong-password',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

        $response->assertRedirect(route('profile.edit'));
        $response->assertSessionHasErrors('current_password');
        $this->assertTrue(Hash::check('old-password', $user->refresh()->password));
    }

    public function test_password_confirmation_must_match(): void
    {
        $user = User::factory()->create(['password' => 'old-password']);

        $response = $this->actingAs($user)->from(route('profile.edit'))->put(route('password.update'), [
            'current_password' => 'old-password',
            'password' => 'new-password',
            'password_confirmation' => 'different-password',
        ]);

        $response->assertRedirect(route('profile.edit'));
        $response->assertSessionHasErrors('password');
        $this->assertTrue(Hash::check('old-password', $user->refresh()->password));
    }
}
