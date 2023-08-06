module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-standard-scss'],
  plugins: ['stylelint-order', 'stylelint-prettier'],
  rules: {
    'prettier/prettier': true,
    'order/properties-alphabetical-order': true,
  },
  overrides: [
    {
      files: ['**/*.{sass,scss}'],
      rules: {
        // rule is only appropriate for CSS, you should not turn it on for Sass
        'media-query-no-invalid': null,
      },
    },
  ],
};
