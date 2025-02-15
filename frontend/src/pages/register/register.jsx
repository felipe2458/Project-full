import style from './register.module.css';
import { Link } from 'react-router-dom';

function Register() {
    return (
        <div className={style.container}>
            <form>
                <header>
                    <h1>Register</h1>
                </header>

                <div className={style.container_inputs}>
                    <div className={style.input_wraper}>
                        <input type="text" name="username" id="username"/>
                        <label htmlFor="username">Username</label>
                        <div className={style.container_icon}>
                            <div className={style.icon} id={style.icon_username} style={{ backgroundImage: 'url(/icons/user_icon.svg)' }}></div>
                        </div>
                    </div>

                    <div className={style.input_wraper}>
                        <input type="password" name="password" id="password"/>
                        <label htmlFor="password">Password</label>
                        <div className={style.container_icon}>
                            <div className={style.icon} id={style.icon_password}style={{ backgroundImage: 'url(/icons/view_password.svg)' }}></div>
                        </div>
                    </div>

                    <div className={style.input_wraper}>
                        <input type="password" name="ConfirmPassword" id="ConfirmPassword"/>
                        <label htmlFor="ConfirmPassword">Confirm Password</label>
                        <div className={style.container_icon}>
                            <div className={style.icon} id={style.icon_password_confirm} style={{ backgroundImage: 'url(/icons/view_password.svg)' }}></div>
                        </div>
                    </div>

                    <div className={style.input_submit}>
                        <input type="submit" value="Create"/>
                    </div>

                    <div className={style.login}>
                        <p>Already have an account? <Link className={style.link} to='/login'>Login</Link></p>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Register;
