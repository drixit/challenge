import { Form, Button } from 'react-bootstrap';
import { useState, FormEvent, ChangeEvent } from 'react';
import { SERVER_URL, NEW_USER, AUTHENTICATE } from './endpoints';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Register = () => {
	const [user, setUser] = useState({
		name: '',
		surname: '',
		age: 0,
		email: '',
		password: '',
		avatar: '',
		// TODO: Improve ID generation
		id: '12345'
	});
	const [admin, setAdmin] = useState(false);
	const navigate = useNavigate();

	const updateUser = (event: any, property: any) => {
    const target = event.target
    console.log(target)

    event.preventDefault()
    setUser((prevState: any) => ({
      ...prevState,
      [property]: event.target.value,
    }))
  }
	
	const onFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const response = await axios.post(SERVER_URL + NEW_USER, { ...user, admin });
		console.log(response);
		navigate(AUTHENTICATE);
	};

	return (
		<Form onSubmit={onFormSubmit}>
			<Form.Group className="mb-3">
				<Form.Label>Name</Form.Label>
				<Form.Control value={user.name} type="text" onChange={(e: ChangeEvent<HTMLInputElement>) => updateUser(e, 'name')} />
			</Form.Group>
			<Form.Group className="mb-3">
				<Form.Label>Surname</Form.Label>
				<Form.Control value={user.surname} type="text" onChange={(e: ChangeEvent<HTMLInputElement>) => updateUser(e, 'surname')} />
			</Form.Group>
			<Form.Group className="mb-3">
				<Form.Label>Age</Form.Label>
				<Form.Control value={user.age} type="text" onChange={(e: ChangeEvent<HTMLInputElement>) => updateUser(e, 'age')} />
			</Form.Group>
			<Form.Group className="mb-3">
				<Form.Label>Email address</Form.Label>
				<Form.Control value={user.email} type="email" onChange={(e: ChangeEvent<HTMLInputElement>) => updateUser(e, 'email')} />
			</Form.Group>
			<Form.Group className="mb-3">
				<Form.Label>Password</Form.Label>
				<Form.Control value={user.password} type="password" onChange={(e: ChangeEvent<HTMLInputElement>) => updateUser(e, 'password')} />
			</Form.Group>
			<Form.Check 
        type="checkbox"
				checked={admin}
        id="is-admin"
        label="Is admin"
				onChange={(e: ChangeEvent<HTMLInputElement>) => setAdmin(!admin)}
      />
			<Button type="submit">Submit</Button>
		</Form>
	);
};

export default Register;