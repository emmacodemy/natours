/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

const stripe = Stripe(
  'pk_test_51HHtcPBmYMIpXg7sq8SnyALYjO5WfwVcgrF3N3rUjRSOOmzQG2zjHdaX04as8buKJAj33EZKfqbWqiCSA9iX9nlo00gxdOsdF2'
);

export const bookTour = async (tourId) => {
  try {
    const session = await axios({
      method: 'get',
      url: `/api/v1/bookings/checkout-session/${tourId}`,
    });

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (error) {
    showAlert('error', error);
  }
};
