import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import MainLayout from "@/layouts/MainLayout";
import LeftSidebar from "@/components/Sidebar/LeftSidebar";
import RightSidebar from "@/components/Sidebar/RightSidebar";
import PostCreator from "@/components/Post/PostCreator";
import PostList from "@/components/Post/PostList";

const HomePage: React.FC = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);

  return (
    <MainLayout>
      <div className="bg-[#1e1f21] min-h-screen">
        <div className="flex justify-between gap-4 max-w-7xl mx-auto px-2 md:px-4 pt-24 pb-6">
          {/* Left Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <LeftSidebar />
          </aside>

          {/* Center Feed */}
          <main className="flex-1 max-w-2xl w-full">
            <PostCreator />
            <PostList />
          </main>

          {/* Right Sidebar */}
          <aside className="hidden xl:block w-72 shrink-0">
            <RightSidebar />
          </aside>
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;
