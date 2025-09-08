export const validateAndGetErrorMessage = (scheme, value) => {
	if (!value) return null;
	let errorMessage = null;

	try {
	  scheme.validateSync(value, { abortEarly: false });
	} catch (err) {
	  if (Array.isArray(err.errors) && err.errors.length > 0)
		errorMessage = err.errors.join('\n');
	}

	return errorMessage;
  };
