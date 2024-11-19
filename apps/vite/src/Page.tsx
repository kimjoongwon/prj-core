import { v4 } from 'uuid';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { BComponent, State } from '@shared/types';
import { toJS } from 'mobx';
import { FormValidator } from './FormValidator';
import { Grid2 as Grid } from '@mui/material';
import { ComponentManager } from '@shared/frontend';

interface PageProps {
  children?: React.ReactNode;
  state: State;
}

export const Page = (props: PageProps) => {
  console.log('render page');
  const { state: _state } = props;

  const state = useLocalObservable(() => _state);

  return (
    <form>
      <Grid {...toJS(state.layout.gridProps)}>
        {state?.form?.components?.map((component, componentNo) => {
          const Component = ComponentManager[component.type];
          return (
            <Grid key={v4()} {...toJS(component.gridProps)}>
              {component.validation ? (
                <FormValidator
                  state={state}
                  componentNo={componentNo}
                  validation={component.validation}
                >
                  <BComponent component={component} />
                </FormValidator>
              ) : (
                <BComponent component={component} />
              )}
            </Grid>
          );
        })}
      </Grid>
    </form>
  );
};

interface ComponentProps {
  component: BComponent;
}

const BComponent = (props: ComponentProps) => {
  const { component } = props;
  const Component = ComponentManager[component.type];

  return (
    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    /* @ts-expect-error */
    <Component {...component.props} state={component.props} path="value" />
  );
};

// interface LayoutProps {
//   children?: React.ReactNode;
//   layout: State['layout'];
// }

// export const Layout = observer((props: LayoutProps) => {
//   const { children, layout } = props;
//   const { data: getPagesResponse } = useGetPages();
//   const pages = getPagesResponse?.data || [];
//   const tabs: Route[] =
//     pages.map(page => ({
//       name: page.name,
//       pathname: page.pathname as Paths,
//     })) || [];
//   const navigate = useNavigate();

//   const state = useLocalObservable(() => ({
//     currentTab: '',
//   }));

//   return (
//     <VStack className="space-y-2 px-4">
//       {layout.type === 'Auth' && <Logo variants={'text'} />}
//       <HStack>
//         {layout?.type === 'Main' &&
//           pages?.map(page => (
//             <Button
//               key={page.pathname}
//               as={Link}
//               href={page.pathname}
//               onClick={() => navigate(page.pathname)}
//             >
//               {page.pathname}
//             </Button>
//           ))}
//       </HStack>
//       {children}
//       {layout.type === 'Main' && (
//         <BottomTab tabs={tabs} state={state} path={'currentTab'} />
//       )}
//     </VStack>
//   );
// });
