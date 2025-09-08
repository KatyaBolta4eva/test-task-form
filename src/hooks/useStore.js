import { useState } from 'react';
import { initialState } from '../initialState/initialState';

export const useStore = () => {
	const [state, setState] = useState(initialState);

	return {
		getState: () => state,
		updatedState: (fieldName, newValue) => {
			setState({ ...state, [fieldName]: newValue });
		},
	};
};

const onEmailChange = ({ target }) => {
	updatedState(target.name, target.value);
	const error = validateAndGetErrorMessage(emailScheme, target.value);
	setErrors((errors) => ({ ...errors, emailErrors: error || '' })); // с или
};
