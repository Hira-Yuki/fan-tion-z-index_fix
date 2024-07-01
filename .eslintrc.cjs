module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended', // 이 줄 추가
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'no-var': 'warn', // var 금지
    'react/jsx-pascal-case': 'warn', // 컴포넌트 이름은 PascalCase로
    'react/jsx-key': 'warn', // 반복문으로 생성하는 요소에 key 강제
  },
};

// 기본 ESLint 설정
