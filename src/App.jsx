import { useState, useRef, useEffect } from 'react';
import { initialErrorsState } from './initialState/initialState';
import { emailScheme, passwordScheme } from './utils/validScheme';
import { validateAndGetErrorMessage } from '../src/utils/validateAndGetErrorMessage';
import { logData } from '../src/utils/logData';
import { useStore } from '../src/hooks/useStore';
import './App.css';

function App() {
	const [errors, setErrors] = useState(initialErrorsState);

	const updatedErrorsMessage = (errors, fieldName, error) => {
		setErrors({ ...errors, [fieldName]: error || '' });
	};

	const toRenewErrorsMessage = (errors, fieldName, text = '') => {
		setErrors({ ...errors, [fieldName]: text });
	};

	const submitButtonRef = useRef(null);
	const previousValidityRef = useRef(false);

	const { getState, updatedState } = useStore();
	const { email, password, repeatPassword } = getState();

	const isFormFilled = Boolean(email && password && repeatPassword);
	const isFormValid =
		!errors.emailErrors && !errors.passwordErrors && !errors.repeatPasswordErrors;
	const isSubmitDisabled = !isFormValid || !isFormFilled;

	useEffect(() => {
		const currentValidity = !isSubmitDisabled;

		if (isFormValid && !previousValidityRef.current && submitButtonRef.current) {
			submitButtonRef.current.focus();
		}
		previousValidityRef.current = currentValidity;
	}, [isSubmitDisabled]);

	const onEmailChange = ({ target }) => {
		updatedState(target.name, target.value);
		const error = validateAndGetErrorMessage(emailScheme, target.value);
		updatedErrorsMessage(errors, 'emailErrors', error);
	};

	const onEmailBlur = ({ target }) => {
		const error = target.value
			? validateAndGetErrorMessage(emailScheme, target.value)
			: 'Email обязателен';
		updatedErrorsMessage(errors, 'emailErrors', error);
	};

	const onPasswordChange = ({ target }) => {
		updatedState(target.name, target.value);
		const error = validateAndGetErrorMessage(passwordScheme, target.value);
		updatedErrorsMessage(errors, 'passwordErrors', error);

		if (!repeatPassword) return;

		if (target.value !== repeatPassword) {
			toRenewErrorsMessage(
				errors,
				'repeatPasswordErrors',
				'Пароли не совпадают!!!',
			);
		} else if (errors.repeatPasswordErrors) {
			toRenewErrorsMessage(errors, 'repeatPasswordErrors');
		}
	};

	const onPasswordBlur = ({ target }) => {
		const error = target.value
			? validateAndGetErrorMessage(passwordScheme, target.value)
			: 'Пароль обязателен';
		updatedErrorsMessage(errors, 'passwordErrors', error);
	};

	const onRepeatPasswordChange = ({ target }) => {
		updatedState(target.name, target.value);

		if (!target.value) return;

		if (password !== target.value) {
			toRenewErrorsMessage(errors, 'repeatPasswordErrors', 'Пароли не совпадают');
		} else if (errors.repeatPasswordErrors) {
			toRenewErrorsMessage(errors, 'repeatPasswordErrors');
		}
	};

	const onRepeatPasswordBlur = ({ target }) => {
		if (!target.value) {
			toRenewErrorsMessage(errors, 'repeatPasswordErrors', 'Подтвердите пароль');
		} else if (password !== target.value) {
			toRenewErrorsMessage(errors, 'repeatPasswordErrors', 'Пароли не совпадают');
		} else {
			toRenewErrorsMessage(errors, 'repeatPasswordErrors');
		}
	};

	const onSubmit = (event) => {
		event.preventDefault();
		const { email, password } = getState();
		logData({ email, password });
	};

	return (
		<>
			<div>
				<form onSubmit={onSubmit}>
					{errors.emailErrors && (
						<div className="errorLabel">{errors.emailErrors}</div>
					)}
					<input
						type="email"
						name="email"
						value={email}
						placeholder="Почта"
						onChange={onEmailChange}
						onBlur={onEmailBlur}
					/>
					{errors.passwordErrors && (
						<div className="errorLabel">{errors.passwordErrors}</div>
					)}
					<input
						type="password"
						name="password"
						value={password}
						placeholder="Пароль"
						onChange={onPasswordChange}
						onBlur={onPasswordBlur}
					/>
					{errors.repeatPasswordErrors && (
						<div className="errorLabel">{errors.repeatPasswordErrors}</div>
					)}
					<input
						type="password"
						name="repeatPassword"
						value={repeatPassword}
						placeholder="Повтор пароля"
						onChange={onRepeatPasswordChange}
						onBlur={onRepeatPasswordBlur}
					/>
					<button
						ref={submitButtonRef}
						type="submit"
						disabled={isSubmitDisabled}
					>
						Зарегистрироваться
					</button>
				</form>
			</div>
		</>
	);
}

export default App;
