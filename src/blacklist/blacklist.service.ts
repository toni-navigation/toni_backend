import { Injectable } from '@nestjs/common';

@Injectable()
export class BlacklistService {
  private readonly blacklist = new Map<string, number>();

  add(token: string, expiration: number): void {
    const expiryTime = Date.now() + expiration;
    this.blacklist.set(token, expiryTime);

    // Automatically remove the token after its expiration
    setTimeout(() => this.blacklist.delete(token), expiration);
  }

  isBlacklisted(token: string): boolean {
    if (!token) return false;

    const expiryTime = this.blacklist.get(token);
    if (!expiryTime) return false;

    if (expiryTime < Date.now()) {
      this.blacklist.delete(token); // Cleanup expired tokens

      return false;
    }

    return true;
  }
}
