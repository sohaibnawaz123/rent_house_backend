module.exports = (sequelize, DataTypes) => {
  const emailOtpTokens = sequelize.define(
    "email_otp_tokens",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      otp_hash: {
        type: DataTypes.STRING(64),
        allowNull: true,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      used: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "email_otp_tokens",
      timestamps: true,
    }
  );

  return emailOtpTokens;
};
