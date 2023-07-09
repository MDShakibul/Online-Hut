import { Cow } from '../cow/cow.model';

export const findSellerExist = async (
  id: string | undefined
): Promise<boolean> => {
  const isSellerExist = await Cow.exists({ seller: id });

  if (!isSellerExist) {
    return true;
  } else {
    return false;
  }
};
