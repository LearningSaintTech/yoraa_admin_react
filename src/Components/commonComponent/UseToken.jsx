import { useSelector } from 'react-redux';

const useToken = () => {
    return useSelector((state) => state.auth.token); // Adjust the selector based on your state structure
};

export default useToken;
