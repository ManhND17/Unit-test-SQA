import AvatarDropdown from '@src/components/AvatarDropdown';
import { ReactNode } from 'react';

interface IArticleLayoutProps {
  header?: ReactNode;
  children: ReactNode;
}

export default function ArticleLayout({
  header,
  children,
}: IArticleLayoutProps) {
  return (
    <div className="min-h-screen bg-white mx-auto w-[90%] py-[30px] lg:py-[50px]">
      <header className="bg-white border-gray-200">
        <div className=" flex justify-between items-center">
          {header}
          <AvatarDropdown />
        </div>
      </header>
      <div>{children}</div>
    </div>
  );
}
