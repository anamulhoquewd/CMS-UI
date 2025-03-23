export const handleAxiosError = (error: any) => {
  // Axios error structure
  if (error.response) {
    // Backend returns a response with status code (4xx, 5xx)

    return {
      message:
        error.response.data.message || "An error occurred on the server.",
      status: error.response.status,
    };
  } else if (error.request) {
    // Request was made but no response was received
    return {
      message: "No response from the server. Please check your connection.",
      status: null,
    };
  } else {
    // Something happened while setting up the request
    return {
      message: "An error occurred while setting up the request.",
      status: null,
    };
  }
};
