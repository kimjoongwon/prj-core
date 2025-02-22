import { CreateContentDto } from '../../../model';
import { DepotUploader } from '../../ui';
import { Section } from '../../ui/Section/Section';
import { Text } from '../../ui/Text';
import { DescriptionInput } from '../inputs/Description/DescriptionInput';
import { ContentTextInput } from '../inputs/Text/ContentTextInput';
import { TitleInput } from '../inputs/Title/TitleInput';

interface ContentFormProps {
  state: CreateContentDto;
}

export const ContentForm = (props: ContentFormProps) => {
  const { state } = props;
  return (
    <Section>
      <Text variant="h5">콘텐츠정보</Text>
      <DepotUploader
        label="썸네일"
        path="depotId"
        state={state}
        selectionMode={'multiple'}
      />
      <TitleInput state={state} path="title" />
      <DescriptionInput state={state} path="description" />
      <ContentTextInput state={state} path="text" />
    </Section>
  );
};
