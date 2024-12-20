'use client';

import { useState } from 'react';
import { sendVerificationCode, verifyCode } from '@/services/emailService';
import Input from '../shared/Input';
import Button from '../shared/Button';
import FindPasswordActions from '@/app/login/find-password/actions';

interface EmailVerificationFormProps {
  handleEmailVerificationSuccess?: () => void; // 반환값을 수정
  username: string;
}

const EmailVerification = ({ username, handleEmailVerificationSuccess }: EmailVerificationFormProps) => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSendVerification = async () => {
    if (!email) {
      setError('이메일을 입력해주세요.');
      return;
    }

    try {
      await FindPasswordActions(username, email);
      await sendVerificationCode(email);
      setIsEmailSent(true);
      setError('');
    } catch {
      setError('이메일 전송에 실패했습니다.');
    }
  };

  const handleSubmitCode = async () => {
    if (!verificationCode) {
      setError('인증번호를 입력해주세요.');
      return;
    }

    setIsVerifying(true);

    try {
      const response = await verifyCode(email, verificationCode);

      if (response.success) {
        setError('');
        alert('인증이 완료되었습니다!');

        if (handleEmailVerificationSuccess) {
          handleEmailVerificationSuccess();
        }
      } else {
        setError('잘못된 인증번호입니다.');
      }
    } catch {
      setError('인증번호 확인에 실패했습니다.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Input
        name="email"
        type="email"
        placeholder="이메일을 입력하세요"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button type="button" onClick={handleSendVerification}>
        인증번호 전송
      </Button>
      {isEmailSent && <p className="text-green-500">인증번호가 이메일로 전송되었습니다.</p>}
      {error && <p className="text-red-500">{error}</p>}
      <Input
        name="verificationCode"
        type="text"
        placeholder="인증번호를 입력하세요"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
      />
      <Button onClick={handleSubmitCode} disabled={isVerifying}>
        {isVerifying ? '인증 중...' : '인증번호 제출'}
      </Button>
    </div>
  );
};

export default EmailVerification;
