import { User } from '../user/user.model';

export const findSeller = async (id: string | undefined): Promise<boolean> => {
  const seller = await User.findById(id);

  if (seller && seller.role === 'seller') {
    return true;
  } else {
    return false;
  }
};
