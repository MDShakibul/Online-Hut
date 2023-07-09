/* eslint-disable @typescript-eslint/no-non-null-assertion */
import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { Cow } from '../cow/cow.model';
import { User } from '../user/user.model';
import { IOrder } from './order.interface';
import { Order } from './order.model';
import { ICow } from '../cow/cow.interface';
import { IUser } from '../user/user.interface';


const createOrder = async (
  payload: IOrder
): Promise<IOrder | null | undefined> => {
  const cowDetails = await Cow.findById(payload.cow);
  const buyerDetails = await User.findById(payload.buyer);

  if (!cowDetails || !buyerDetails) {
    throw new ApiError(400, 'Not found');
  }

  if (cowDetails.price > buyerDetails.budget) {
    throw new ApiError(422, 'Buyer does not have enough budget');
  }

  if (cowDetails.label === 'sold out') {
    throw new ApiError(422, 'Cow already sold');
  }


  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const cow = await Cow.findById(payload.cow).session(session);
    if (!cow) {
      throw new ApiError(400, 'Cow not found');
    }


    cow.label = 'sold out';
    await cow.save();


    const seller = await User.findById(cowDetails.seller).session(session);
    const buyer = await User.findById(payload.buyer).session(session);



    if (!seller || !buyer) {
      throw new ApiError(400, 'Not found');
    }

    /* seller.income += cowDetails.price;
    buyer.budget -= cowDetails.price; */


// Update cow seller within the session
const updatedSeller = await User.findByIdAndUpdate(
  cowDetails.seller,
  { $inc: { income: cowDetails.price } },
  { new: true, session }
);

// Update buyer budget within the session
const updatedBuyer = await User.findByIdAndUpdate(
  payload.buyer,
  { $inc: { budget: -cowDetails.price } },
  { new: true, session }
);

    /* await seller.save();
    await buyer.save(); */
    const order = await Order.create([payload], { session });
    const result = await Order.populate(order, [
      {
        path: 'cow',
        populate: {
          path: 'seller',
          model: 'User'
        }
      },
      {
        path: 'buyer',
        model: 'User'
      }
    ]);

      // Update order with populated fields
      const updatedOrder = result[0];

      if (updatedOrder) {
        const cowDetails: ICow | undefined = updatedOrder.cow as ICow;
        if (cowDetails) {
          cowDetails.seller = updatedSeller as IUser;
        }
        updatedOrder.buyer = updatedBuyer as IUser;
      }


    await session.commitTransaction();
    await session.endSession();

    return result[0];
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};


const getAllOrders = async (_id: string, role: string): Promise<IOrder[] | null> => {
  let filter = {};

  console.log(_id, role)

  if (role === 'buyer') {
    filter = { buyer: _id };
  } else if (role === 'seller') {
    filter = { 'cow.seller': _id };
  }
  
  const result = await Order.find(filter).populate([
    {
      path: 'cow',
      populate: {
        path: 'seller',
        model: 'User',
      },
    },
    {
      path: 'buyer',
      model: 'User',
    },
  ]);

  return result;
};

const getSingleOrders = async (Id: string): Promise<IOrder | null> => {
  const result = await Order.findById(Id).populate([
    {
      path: 'cow',
      populate: {
        path: 'seller',
        model: 'User',
      },
    },
    {
      path: 'buyer',
      model: 'User',
    },
  ]);
  

  return result;
};

export const OrderService = {
  createOrder,
  getAllOrders,
  getSingleOrders
};
