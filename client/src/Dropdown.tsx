import { Avatar, Dropdown } from 'flowbite-react';
import { RxAvatar } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dropdown_() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        localStorage.clear();
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/logout`)
          if (response.data.Status == "Success") {
            navigate("/", {replace:true});
          }
        } catch (error) {
          console.log(error);
        }
      };
  return (
    <Dropdown
      label={<RxAvatar size={38}/>}
      arrowIcon={false}
      inline
    >
      <Dropdown.Header>
        <span className="block truncate text-xl font-medium">{localStorage.getItem('email')}</span>
      </Dropdown.Header>
      <Dropdown.Divider />
      <Dropdown.Item className='text-lg' onClick={() => handleLogout()}>Sign out</Dropdown.Item>
    </Dropdown>
  );
}

export default Dropdown_;
