const responseFormat = (success, status, endpoint, message = '', info) => {
    return {
      success,
      status,
      endpoint,
      message,
      info,
    };
}

export default responseFormat;