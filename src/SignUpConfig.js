const signUpConfig = {
    header: 'Shalvas ToDoApp SignUp Config',
    hideAllDefaults: true,
    defaultCountryCode: '1',
    signUpFields: [
        {
            label: 'Username',
            key: 'username',
            required: true,
            displayOrder: 1,
            type: 'string'
        }, {
            label: 'Email',
            key: 'email',
            required: true,
            displayOrder: 2,
            type: 'email'
        }, {
            label: 'Password',
            key: 'password',
            required: true,
            displayOrder: 3,
            type: 'password'
        }, {
            label: 'Mobile',
            key: 'phone_number',
            required: true,
            displayOrder: 4,
            type: 'phone_number'
        },
    ]
};
export default signUpConfig;