import React, { ReactNode, useMemo } from 'react';
import { BaseProps } from '../@types/common';
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import useVersion from '../hooks/useVersion';
import IconWithDot from './IconWithDot';
import { PiChartBar, PiGear } from 'react-icons/pi';
import { fetchAuthSession } from 'aws-amplify/auth';
import useUserSetting from '../hooks/useUserSetting';
import { useTranslation } from 'react-i18next';

type Props = BaseProps & {
  builderMode?: boolean;
  children: ReactNode;
};

const DrawerBase: React.FC<Props> = (props) => {
  const { getHasUpdate } = useVersion();
  const { settingShowEmail } = useUserSetting();
  const { t } = useTranslation();

  // The first argument is not required, but if it is not included, the request will not be made, so 'user' string is entered
  const { data } = useSWR('user', () => {
    return fetchAuthSession();
  });

  const email = useMemo<string>(() => {
    return (data?.tokens?.idToken?.payload.email ?? '') as string;
  }, [data]);

  const hasUpdate = getHasUpdate();

  const settingUrl = useMemo(() => {
    return props.builderMode ? `/use-case-builder/setting` : 'setting';
  }, [props.builderMode]);

  return (
    <>
      <nav
        className={`bg-aws-squid-ink flex h-screen w-64 flex-col justify-between text-sm text-white  print:hidden`}>
        <div className="flex h-full flex-col">
          {props.children}
          <div className="flex flex-none items-center justify-between gap-x-2 border-t border-gray-400 px-3 py-2">
            {settingShowEmail && (
              <div className="truncate text-xs">{email}</div>
            )}
            <div className="grow" />
            <Link to="/stats" title={t('stat.title')}>
              <PiChartBar className="text-lg" />
            </Link>
            <Link to={settingUrl}>
              <IconWithDot showDot={hasUpdate}>
                <PiGear className="text-lg" />
              </IconWithDot>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default DrawerBase;
