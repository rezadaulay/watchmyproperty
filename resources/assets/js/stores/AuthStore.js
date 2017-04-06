import alt from '../alt';
import AuthActions from '../actions/AuthActions';
import InterceptorUtil from '../utils/InterceptorUtil';
import Config from '../config';
import axios from 'axios';
import Uri from 'jsuri';

import { hashHistory } from 'react-router';


class AuthStore {
  constructor() {
    this.bindActions(AuthActions);

    // State
    this.accessToken = null;
    this.refreshToken = null;
    this.user = null;
    this.error = null;
  }

  /**
   * Login handler
   * @param credentials
   */
  onLogin(credentials) {
    axios
      .post(Config.apiUrl+'/auth/login',{
        username: credentials.username,
        password: credentials.password,
        grant_type: 'password',
        client_id: Config.clientId,
        client_secret: Config.clientSecret,
      })
      .then(response => {
        this.saveTokens(response.data);
        return this.loginSuccess(response.data, false);
      })
      .catch(response => {
		this.loginError(response);
      });
  }

  /**
   * Process login success
   * @param user
   */
  loginSuccess(user, localLogin) {
    localStorage.setItem('user', JSON.stringify({
		'id' : user.user_id,
		'name' : user.user_fullname
	}));

    this.setState({ user: user });
	if( !localLogin )
		hashHistory.push('/');
  }

  /**
   * Handle login error
   * @param response
   */
  loginError(response) {
    this.setState({ accessToken: null, refreshToken: null, error: response.data.error, user: null});
  }

  /**
   * Try to connect user from local storage
   */
  onLocalLogin() {
    let accessToken = localStorage.getItem('access_token');
    let refreshToken = localStorage.getItem('refresh_token');
    let user = JSON.parse(localStorage.getItem('user'));

    if (accessToken && refreshToken && user) {
      this.saveTokens({access_token: accessToken, refresh_token: refreshToken});
      this.loginSuccess(user, true);
    }
  }

  /**
   * Try to refresh user access token
   */
  onRefreshToken(params) {
    let refreshToken = localStorage.getItem('refresh_token');

    if (refreshToken) {
      axios.interceptors.request.eject(InterceptorUtil.getInterceptor());
      axios
		.post(Config.apiUrl+'/auth/refresh',{
			grant_type: 'refresh_token',
			client_id: Config.clientId,
			client_secret: Config.clientSecret,
			refresh_token: refreshToken,
		})
        .then(response => {
          this.saveTokens(response.data);

          // Replay request
          axios(params.initialRequest).then(response => {
            params.resolve(response);
          }).catch(response => {
            params.reject(response);
          });
        })
        .catch(() => {
          this.onLogout();
        });
    }
	else
		this.onLogout();
  }

  /**
   * Logout user
   */
  onLogout() {
    localStorage.clear();

    this.setState({ accessToken: null, refreshToken: null, error: null});

    axios.interceptors.request.eject(InterceptorUtil.getInterceptor());

	hashHistory.push('login');
  }

  /**
   * Save tokens in local storage and automatically add token within request
   * @param params
   */
  saveTokens(params) {
    const {access_token, refresh_token} = params;

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    this.setState({ accessToken: access_token, refreshToken: refresh_token, error: null});

    // Automatically add access token
    var interceptor = axios.interceptors.request.use((config) => {
      config.headers = {'Authorization': 'Bearer '+ access_token};
      return config;
    });

    InterceptorUtil.setInterceptor(interceptor)
  }
}

export default alt.createStore(AuthStore, 'AuthStore');
