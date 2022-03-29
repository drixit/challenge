import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './Login';
import UserInfo from './UserInfo';
import Register from './Register';
import * as urls from './urls';
import './index.css';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path={urls.LOGIN_PATH} element={<Login />} />
				<Route path={urls.USER_INFO_PATH} element={<UserInfo />} />
				<Route path={urls.REGISTER_PATH} element={<Register />} />
				<Route path={urls.HOME_PATH} element={<Navigate to={urls.LOGIN_PATH} replace />} />
				<Route path="*" element={<Navigate to={urls.HOME_PATH} replace />} />
			</Routes>
		</BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
