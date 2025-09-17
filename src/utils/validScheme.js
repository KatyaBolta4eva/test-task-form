import * as yup from 'yup';

export const emailScheme = yup
	.string()
	.required('Email обязателен')
	.min(5, 'Слишком короткий email.')
	.matches(/^\S{2,}@\S{2,}\.[a-zA-Z]{2,10}$/, 'Введите корректный email адрес');

export const passwordScheme = yup
	.string()
	.required('Пароль обязателен')
	.min(8, 'Пароль должен содержать мининмум 8 символов')
	.matches(
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
		'Пароль должен содержать заглавные и строчные буквы и цифры',
	);
