'use client';

import { Card, CardHeader, CardBody, CardFooter } from '@heroui/react';
import {
  Button,
  DepotUploader,
  EmailInput,
  Input,
  InputValidation,
  Text,
} from '@shared/frontend';
import { useGymEditPage } from './_hooks/useGymEdit';
import { observer } from 'mobx-react-lite';

const GymEditPage = observer(() => {
  const gymEditPage = useGymEditPage();

  return (
    <Card>
      <CardHeader>
        <Text variant="h4">GYM편집</Text>
      </CardHeader>
      <CardBody>
        <Card>
          <CardBody className="space-y-4">
            <DepotUploader
              type="image"
              label="BRAND LOGO"
              selectionMode="single"
              state={gymEditPage.form.state.inputs}
              path="depotId"
            />
            <InputValidation
              validation={{
                timings: ['onChange'],
                required: { value: true, message: '지점명을 입력해주세요.' },
                minLength: { value: 1, message: '최소 1자를 입력해주세요.' },
                maxLength: { value: 50, message: '최대 50자를 입력해주세요.' },
              }}
            >
              <Input
                readOnly={gymEditPage.read}
                label="지점명"
                placeholder="지점명을 입력해주세요."
                state={gymEditPage.form.state.inputs}
                path="space.name"
              />
            </InputValidation>

            <Input
              readOnly={gymEditPage.read}
              label="라벨"
              placeholder='ex) "서울 강남점"'
              state={gymEditPage.form.state.inputs}
              path="space.label"
            />
            <EmailInput
              readOnly={gymEditPage.read}
              state={gymEditPage.form.state.inputs}
              path="email"
            />
            <Input
              label="주소"
              placeholder="주소를 입력해주세요."
              readOnly={gymEditPage.read}
              state={gymEditPage.form.state.inputs}
              path="address"
            />
            <Input
              label="전화번호"
              placeholder="전화번호를 입력해주세요."
              readOnly={gymEditPage.read}
              state={gymEditPage.form.state.inputs}
              path="phone"
            />
            <Input
              readOnly={gymEditPage.read}
              label="사업자번호"
              placeholder="사업자번호를 입력해주세요."
              state={gymEditPage.form.state.inputs}
              path="businessNumber"
            />
          </CardBody>
        </Card>
      </CardBody>
      <CardFooter>
        <Button onPress={gymEditPage.form.onPressSave}>저장</Button>
        <Button onPress={gymEditPage.form.onPressList}>목록</Button>
      </CardFooter>
    </Card>
  );
});

export default GymEditPage;
