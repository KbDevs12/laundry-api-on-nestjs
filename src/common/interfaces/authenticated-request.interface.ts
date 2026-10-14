import { Profile } from '../../generated/prisma/client';

export interface AuthenticatedRequest extends Request {
  user: Profile;
}
