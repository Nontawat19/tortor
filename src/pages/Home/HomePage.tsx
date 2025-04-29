import React from "react";
import MainLayout from "@/layouts/MainLayout";
import LeftSidebar from "@/components/Sidebar/LeftSidebar";
import RightSidebar from "@/components/Sidebar/RightSidebar";
import PostCreator from "@/components/Post/PostCreator";
import PostList from "@/components/Post/PostList";

import "@/styles/HomePage.css";

const HomePage: React.FC = () => {
  return (
    <MainLayout>
      <div className="layout-content">
        <aside className="sidebar-left">
          <LeftSidebar />
        </aside>

        <main className="feed-center">
          <PostCreator />
          <PostList />
        </main>

        <aside className="sidebar-right">
          <RightSidebar />
        </aside>
      </div>
    </MainLayout>
  );
};

export default HomePage;
