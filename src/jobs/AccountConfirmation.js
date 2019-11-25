const sendMail = require('../lib/Mail');

module.exports = {
  key: 'AccountConfirmation',
  async handle({ data }) {
    const { user, redirect } = data;
    await sendMail({
      to: `${user.name} <${user.email}>`,
      subject: 'Check your email address',
      template: 'account_confirmation',
      context: {
        link: `${redirect}/?token=${user.token}`
      }
    });
  }
};