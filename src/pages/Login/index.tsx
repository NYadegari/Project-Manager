import { useAuth } from "../../context/Authentication/index";
import styles from './Login.module.scss';
import * as Yup from "yup";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLoading } from '../../context/Loading/index';
import { useNavigate } from 'react-router-dom';

interface LoginFormData {
  username: string;
  password: string;
  email: string;
}

interface LoginProps {}

const validationSchema = Yup.object({
  username: Yup.string().required("Username is required").min(3, "Username must be at least 3 characters"),
  password: Yup.string().required("Password is required").min(4, "Password must be at least 4 characters").max(22, "Password must not exceed 22 characters"),
  email: Yup.string().required("Email is required").email("Invalid email format")
});

const Login: React.FC<LoginProps> = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const { setLoading } = useLoading();
    
    const { 
      register, 
      handleSubmit, 
      formState: { errors, isValid } 
    } = useForm<LoginFormData>({
      resolver: yupResolver(validationSchema),
      mode: "onChange"
    });

    const handleNavigate = (path: string) => {
      setLoading(true);
      setTimeout(() => {
        navigate(path);
        setLoading(false);
      }, 1000);
    };

    const onSubmit = (data: LoginFormData) => {
      setAuth({
        user: {
          id: Date.now().toString(),
          name: data.username,
          email: data.email,
          password: data.password,
        }
      });
      handleNavigate("/");
    };

    return (
      <div className={styles.body}>
          <h1>Login page</h1>
          <div className={styles.form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.inputs}>
                <label htmlFor="email">Email</label>
                <input 
                  {...register("email")} 
                  id='email' 
                  type="text" 
                />
                {errors.email && (
                  <span className='text-red-700 text-xs'>
                    {errors.email.message}
                  </span>
                )}

                <label htmlFor="username">Username</label>
                <input 
                  {...register("username")} 
                  id='username' 
                  type="text" 
                />
                {errors.username && (
                  <span className='text-red-700 text-xs'>
                    {errors.username.message}
                  </span>
                )}

                <label htmlFor="password">Password</label>
                <input 
                  {...register("password")} 
                  id='password' 
                  type="password"
                />
                {errors.password && (
                  <span className='text-red-700 text-xs'>
                    {errors.password.message}
                  </span>
                )}
              </div>
              <button 
                type="submit" 
                disabled={!isValid}
              >
                Submit
              </button>
            </form>
          </div>
      </div>
    );
};


export default Login;
