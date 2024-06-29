import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import ErrorMessage from '../../components/error-message.component';
import { loginService, registerService, uploadImage } from '../../helpers/services';
import LoadingIndicator from '../../components/loading-indicatoe.component';
import { validateEmail } from '../../helpers/helper';

const Home = ({ login }) => {
    const history = useHistory()
    const profileRef = useRef()
    const [isSignup, setIsSignup] = useState(false);
    const [userData, setUserData] = useState({
        email: "",
        password: "",
        name: "",
        profile: "",
    });
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)

    const toggleForm = () => {
        setIsSignup(!isSignup);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateEmail(userData.email)) return setError("Enter correct E-mail.")
        if (!isSignup) {
            loginService(userData.email, userData.password)
                .then(res => {
                    console.log(res)
                    localStorage.setItem("userInfo", JSON.stringify(res))
                    history.push('/chats')
                    login(true)
                })
                .catch(e => setError(e))
        } else {
            registerService(userData.name, userData.profile, userData.email, userData.password)
                .then(res => {
                    localStorage.setItem("userInfo", JSON.stringify(res))
                    login(true)
                })
                .catch(e => setError(e.message))
        }
    };

    const imageUpload = (file) => {
        if (file) {
            setLoading(true);
            uploadImage(file)
                .then(res => setUserData(obj => ({ ...obj, profile: res.url })))
                .catch(err => setError(err.message))
                .finally(() => setLoading(false));
        }
    }


    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"))
        user && history.push("/chats");
    }, [])

    return (
        <div className='login'>
            <div className="wrapper">
                {loading && <LoadingIndicator />}
                <div className="title-text">
                    <div className="title login" style={{ marginLeft: isSignup ? '-50%' : '0' }}>Login Form</div>
                    <div className="title signup">Signup Form</div>
                </div>
                <div className="form-container">
                    <div className="slide-controls">
                        <input
                            type="radio"
                            name="slide"
                            id="login"
                            checked={!isSignup}
                            onChange={() => setIsSignup(false)}
                        />
                        <input
                            type="radio"
                            name="slide"
                            id="signup"
                            checked={isSignup}
                            onChange={() => setIsSignup(true)}
                        />
                        <label htmlFor="login" className="slide login" onClick={() => setIsSignup(false)}>
                            Login
                        </label>
                        <label htmlFor="signup" className="slide signup" onClick={() => setIsSignup(true)}>
                            Signup
                        </label>
                        <div className="slider-tab" style={{ left: isSignup ? '50%' : '0' }}></div>
                    </div>
                    <div className="form-inner" >
                        <form action="#" onSubmit={handleSubmit} className="login" style={{ marginLeft: isSignup ? '-50%' : '0' }}>
                            <div className="field">
                                <input type="email" autoComplete='email' placeholder="Email Address" onChange={e => setUserData(obj => ({ ...obj, email: e.target.value }))} required />
                            </div>
                            <div className="field">
                                <input type="password" placeholder="Password" onChange={e => setUserData(obj => ({ ...obj, password: e.target.value }))} required />
                            </div>
                            {/* <div className="pass-link"><a href="#">Forgot password?</a></div> */}
                            <ErrorMessage message={error} />
                            <div className="field btn">
                                <div className="btn-layer"></div>
                                <input type="submit" value="Login" />
                            </div>
                            <div className="signup-link">Not a member? <a href="#" onClick={(e) => { e.preventDefault(); toggleForm(); }}>Signup now</a></div>
                        </form>

                        <form onSubmit={handleSubmit} className="signup">
                            <div className="field">
                                <input type="text" placeholder="Email Address" onChange={e => setUserData(obj => ({ ...obj, email: e.target.value }))} required />
                            </div>

                            <div className="field">
                                <input
                                    type="text"
                                    placeholder='Name'
                                    value={userData.name}
                                    onChange={e => setUserData(obj => ({ ...obj, name: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="field">
                                <button type='button' className='upload-button' onClick={() => profileRef.current.click()}>Upload Image</button>
                                <input
                                    ref={profileRef}
                                    type="file"
                                    accept="image"
                                    className="profile"
                                    id="profile"
                                    onChange={(e) => imageUpload(e.target.files[0])}
                                />
                            </div>


                            <div className="field">
                                <input type="password" placeholder="Password" onChange={e => setUserData(obj => ({ ...obj, password: e.target.value }))} required />
                            </div>

                            {/* <div className="field">
                                <input type="password" placeholder="Confirm password"  required />
                            </div> */}

                            <div className="field btn">
                                <div className="btn-layer"></div>
                                <input type="submit" value="Signup" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
