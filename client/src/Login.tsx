import axios from 'axios';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { SERVER_URL, AUTHENTICATE, USER_INFO } from '../../endpoints';

type FieldProps = {
	type: string;
	changeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
};

const Field = ({ type, changeHandler }: FieldProps) => {
	return (
		<div>
			<input type={type} onChange={changeHandler}/>
		</div>
	);
};

async function postCredentials(email: string, password: string) {
	const data = {
		email: email,
		password: password,
	};
	const res = await axios.post(SERVER_URL + AUTHENTICATE, data)

	return res.data.jwt;
}
async function getUserInfo(token: string) {
	const res = await axios.get(SERVER_URL + USER_INFO, {
		headers: {
			Authorization: 'Bearer ' + token
		}
	});
	return res.data;
}

const Form = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value);
	const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value);
	const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
		const token = await postCredentials(email, password);
		const userInfo = await getUserInfo(token);
		navigate('/user-info', { state: userInfo });
  };

	return (
		<div className="container">
			<form onSubmit={handleSubmit}>
				<Field type="email" changeHandler={handleEmailChange}/>
				<Field type="password" changeHandler={handlePasswordChange}/>
				<div>
          <button type="submit">Submit</button>
        </div>
			</form>
		</div>
	);
}

const Login = () => {
  return (
    <div className="Login">
			<Form/>
    </div>
  );
}

export default Login;
