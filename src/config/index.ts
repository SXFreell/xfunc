import devConfig from './development';
import proConfig from './production';

export default process.env.NODE_ENV === 'production' ? proConfig : devConfig;