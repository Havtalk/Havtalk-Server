export function getPasswordResetHtml({
  email,
  resetLink,
  companyName,
  year,
}: {
  email: string;
  resetLink: string;
  companyName: string;
  year: number;
}) {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <link
      rel="preload"
      as="image"
      href="https://new.email/static/app/placeholder.png" />
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
  </head>
  <body
    style='background-color:rgb(243,244,246);font-family:ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";padding-top:40px;padding-bottom:40px'>
    <!--$-->
    <div
      style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">
      Reset your password - Action required
    </div>
    <table
      align="center"
      width="100%"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="background-color:rgb(255,255,255);border-radius:8px;box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), 0 1px 2px 0 rgb(0,0,0,0.05);max-width:600px;margin-left:auto;margin-right:auto;padding:40px">
      <tbody>
        <tr style="width:100%">
          <td>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="text-align:center;margin-bottom:32px">
              <tbody>
                <tr>
                  <td>
                    <img
                      alt="Company Logo"
                      src="https://new.email/static/app/placeholder.png"
                      style="width:100%;height:auto;object-fit:cover;max-width:200px;margin-left:auto;margin-right:auto;display:block;outline:none;border:none;text-decoration:none" />
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="text-align:center;margin-bottom:32px">
              <tbody>
                <tr>
                  <td>
                    <h1
                      style="font-size:24px;font-weight:700;color:rgb(17,24,39);margin:0px;margin-bottom:8px">
                      Reset Your Password
                    </h1>
                    <p
                      style="font-size:16px;color:rgb(75,85,99);margin:0px;line-height:24px;margin-bottom:0px;margin-top:0px;margin-left:0px;margin-right:0px">
                      We received a request to reset your password
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="margin-bottom:32px">
              <tbody>
                <tr>
                  <td>
                    <p
                      style="font-size:16px;color:rgb(55,65,81);margin-bottom:0px;margin:0px;line-height:24px;margin-top:0px;margin-left:0px;margin-right:0px">
                      Hello,
                    </p>
                    <p
                      style="font-size:16px;color:rgb(55,65,81);margin-bottom:0px;margin:0px;line-height:24px;margin-top:0px;margin-left:0px;margin-right:0px">
                      Someone requested a password reset for your account
                      associated with
                      <!-- -->sohamhaldar25@gmail.com<!-- -->. If this was you,
                      click the button below to reset your password.
                    </p>
                    <p
                      style="font-size:16px;color:rgb(55,65,81);margin-bottom:0px;margin:0px;line-height:24px;margin-top:0px;margin-left:0px;margin-right:0px">
                      This link will expire in
                      <!-- -->24 hours<!-- -->
                      for security reasons.
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="text-align:center;margin-bottom:32px">
              <tbody>
                <tr>
                  <td>
                    <a
                      href=${resetLink}
                      style="background-color:rgb(37,99,235);color:rgb(255,255,255);padding-left:32px;padding-right:32px;padding-top:16px;padding-bottom:16px;border-radius:8px;font-size:16px;font-weight:600;text-decoration-line:none;box-sizing:border-box;display:inline-block;line-height:100%;text-decoration:none;max-width:100%;mso-padding-alt:0px;padding:16px 32px 16px 32px"
                      target="_blank"
                      ><span
                        ><!--[if mso]><i style="mso-font-width:400%;mso-text-raise:24" hidden>&#8202;&#8202;&#8202;&#8202;</i><![endif]--></span
                      ><span
                        style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:12px"
                        >Reset Password</span
                      ><span
                        ><!--[if mso]><i style="mso-font-width:400%" hidden>&#8202;&#8202;&#8202;&#8202;&#8203;</i><![endif]--></span
                      ></a
                    >
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="margin-bottom:32px">
              <tbody>
                <tr>
                  <td>
                    <p
                      style="font-size:14px;color:rgb(75,85,99);margin-bottom:0px;margin:0px;line-height:24px;margin-top:0px;margin-left:0px;margin-right:0px">
                      If the button doesn&#x27;t work, copy and paste this link
                      into your browser:
                    </p>
                    <a
                      href="${resetLink}"
                      style="color:rgb(37,99,235);font-size:14px;word-break:break-all;text-decoration-line:underline"
                      target="_blank"
                    >${resetLink}</a>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="background-color:rgb(249,250,251);padding:20px;border-radius:8px;margin-bottom:32px">
              <tbody>
                <tr>
                  <td>
                    <p
                      style="font-size:14px;color:rgb(55,65,81);margin-bottom:0px;margin:0px;font-weight:600;line-height:24px;margin-top:0px;margin-left:0px;margin-right:0px">
                      Security Notice:
                    </p>
                    <p
                      style="font-size:14px;color:rgb(75,85,99);margin:0px;line-height:24px;margin-bottom:0px;margin-top:0px;margin-left:0px;margin-right:0px">
                      If you didn&#x27;t request this password reset, please
                      ignore this email. Your password will remain unchanged.
                      For security, never share this link with anyone.
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="margin-bottom:32px">
              <tbody>
                <tr>
                  <td>
                    <p
                      style="font-size:14px;color:rgb(75,85,99);margin:0px;line-height:24px;margin-bottom:0px;margin-top:0px;margin-left:0px;margin-right:0px">
                      Need help? Contact our support team at<!-- -->
                      <a
                        href="mailto:support@company.com"
                        style="color:rgb(37,99,235);text-decoration-line:underline"
                        target="_blank"
                        >support@company.com</a
                      >
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="border-top-width:1px;border-color:rgb(229,231,235);padding-top:24px">
              <tbody>
                <tr>
                  <td>
                    <p
                      style="font-size:12px;color:rgb(107,114,128);text-align:center;margin:0px;margin-bottom:0px;line-height:24px;margin-top:0px;margin-left:0px;margin-right:0px">
                      This email was sent to
                      <!-- -->${email}<!-- -->
                    </p>
                    <p
                      style="font-size:12px;color:rgb(107,114,128);text-align:center;margin:0px;margin-bottom:0px;line-height:24px;margin-top:0px;margin-left:0px;margin-right:0px">
                      Company Name, 123 Business Street, City, State 12345
                    </p>
                    <p
                      style="font-size:12px;color:rgb(107,114,128);text-align:center;margin:0px;line-height:24px;margin-bottom:0px;margin-top:0px;margin-left:0px;margin-right:0px">
                      © ${year} Company Name. All rights reserved.
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <!--7--><!--/$-->
  </body>
</html>
`;
}
