import axios from 'axios';
// import { CookiesProvider, useCookies } from 'react-cookie';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { SERVER_URL, AUTHENTICATE, USER_INFO } from './endpoints';

type FieldProps = {
	type: string,
	changeHandler: (event: ChangeEvent<HTMLInputElement>) => void,
	placeholder: string
};
type ShowPasswordBtnProps = {
	email: string,
	isFormatValid: boolean, 
	setValidFormat: (isValid: boolean) => void,
	changeHandler: (event: ChangeEvent<HTMLInputElement>) => void,
	setShowPasswordBtnClicked: (isValid: boolean) => void,
	isCorrectPassword: boolean
}

const Field = ({ type, changeHandler, placeholder }: FieldProps) => {
	return (
		<div>
			<input type={type} onChange={changeHandler} placeholder={placeholder}/>
		</div>
	);
};

async function postCredentials(email: string, password: string) {
	const data = {
		email: email,
		password: password,
	};

	return axios.post(SERVER_URL + AUTHENTICATE, data, { withCredentials: true });
}
async function getUserInfo(token: string) {
	const res = await axios.get(SERVER_URL + USER_INFO, {
		headers: {
			Authorization: 'Bearer ' + token
		}
	});
	return res.data;
}

const ShowPasswordButton = (props: ShowPasswordBtnProps) => {
	const [submitBtnClicked, setSubmitBtnClicked] = useState(false);

	const handleClick = () => {
		props.setShowPasswordBtnClicked(true);
		// Got the regexp from https://ihateregex.io/expr/email/
		const regex = new RegExp('[^@ \\t\\r\\n]+@[^@ \\t\\r\\n]+\\.[^@ \\t\\r\\n]+');

		if (regex.test(props.email)) {
			props.setValidFormat(true);
		} else {
			alert('Please enter a valid email format');
		}
	}

	if (!props.isFormatValid) {
		return (
			<div>
				<button type="button" onClick={handleClick}>Next</button>
			</div>
		);
	} else {
		return (
			<div>
				<Field type="password" changeHandler={props.changeHandler} placeholder="Password"/>
				{
					!props.isCorrectPassword && submitBtnClicked &&
					<span className="error">Incorrect password or user not registered</span>
				}
				<div>
					<button type="submit" onClick={() => setSubmitBtnClicked(true)}>Submit</button>
				</div>
			</div>
		);
	}
}

const EmailForm = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [validFormat, setValidFormat] = useState(false);
	const [showPasswordBtnClicked, setShowPasswordBtnClicked] = useState(false);
	const [correctPassword, setCorrectPassword] = useState(false);
	// const [cookies, setCookie] = useCookies();
	const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value);
	const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value);
	const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (password) {
			const response = await postCredentials(email, password);
	
			if (response.status === 200) {
				setCorrectPassword(true);

				console.log(response.headers);

				const token = response.data.jwt;
				const userInfo = await getUserInfo(token);
	
				navigate('/user-info', { state: userInfo });
			}
		}
  };

	return (
		<div className="container">
			<form onSubmit={handleSubmit}>
				<Field type="email" changeHandler={handleEmailChange} placeholder="Email"/>
				{
					!validFormat && showPasswordBtnClicked &&
					<span className="error">Please enter a valid email format</span>
				}
				<ShowPasswordButton
					email={email}
					isFormatValid={validFormat}
					setValidFormat={setValidFormat}
					changeHandler={handlePasswordChange}
					setShowPasswordBtnClicked={setShowPasswordBtnClicked}
					isCorrectPassword={correctPassword}/>
			</form>
		</div>
	);
}

const Login = () => {
  return (
    <div className="Login">
			{/* <CookiesProvider> */}
				<EmailForm/>
			{/* </CookiesProvider> */}
    </div>
  );
}

export default Login;
