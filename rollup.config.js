import typescript from 'rollup-plugin-typescript2';
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';

export default {
  input: 'src/index.ts',
  output: {
    file: './dist/app.js',
    format: 'cjs',
  },
  plugins: [
    typescript({ tsconfig: 'tsconfig.json', typescript: require('typescript') }),
    serve({
      host: 'localhost',
      port: 3003,
      historyApiFallback: true,
      open: true,
      contentBase: ['./'],
    }),
    livereload({
      watch: 'dist',
    }),
  ],
};
