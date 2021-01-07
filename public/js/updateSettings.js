import axios from 'axios';
import { showAlert } from './alert';

export const updateSettings = async (data, type) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/${
        type === 'password' ? 'updatePassword' : 'updateMe'
      }`,
      withCredentials: true,
      data,
    });

    if (res.data.status === 'success')
      showAlert('success', `${type} updated successfully`);
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
