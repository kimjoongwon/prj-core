// import { StringField } from '../../../decorators';
// import {
//   AppBuilder,
//   ComponentBuilder,
//   FormBuilder,
//   LayoutBuilder,
//   PageBuilder,
//   RouteBuilder,
//   ValidationBuilder,
// } from '@shared/types';

// export class AppBuilderDto implements AppBuilder {
//   routes: RouteBuilder[];

//   @StringField({ description: '탭 이름' })
//   name: string;

//   @StringField({ description: '탭 경로' })
//   pathname: string;
// }

// export class RouteBuilderDto implements RouteBuilder {
//   layout: LayoutBuilderDto;
//   active: boolean;
//   pathname: string;
//   name: string;
// }

// export class LayoutBuilderDto implements LayoutBuilder {
//   page: PageBuilderDto;
// }

// export class PageBuilderDto implements PageBuilder {
//   name: string;
//   forms?: FormBuilder[];
// }

// export class FormBuilderDto implements FormBuilder {
//   components: ComponentBuilderDto[];
//   gridProps?: object;
//   data: object;
//   name: string;
// }

// export class ComponentBuilderDto implements ComponentBuilder {
//   type: 'Input' | 'Spacer' | 'Button' | 'AppBar' | 'Text' | 'Image' | 'DataGrid' | 'BottomTab';
//   gridProps?: object;
//   validation?: ValidationBuilder;
//   name: string;
//   props: object;
// }
