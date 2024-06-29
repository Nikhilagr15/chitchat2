export function receiver(users, loggedinUser) {
    const usr = users.find(({ _id }) => _id !== loggedinUser._id)
    return usr
}

export function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}