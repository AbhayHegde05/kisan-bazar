"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConversations } from "../redux/slices/messageSlice";
import MessageItem from "../components/MessageItem";
import Loader from "../components/Loader";
import { FaComments } from "react-icons/fa";

const MessagesPage = () => {
  const dispatch = useDispatch();

  // SAFE defaults to avoid undefined crashes
  const { conversations = [], loading } = useSelector(
    (state) => state.messages || {}
  );

  useEffect(() => {
    dispatch(getConversations());

    // Poll for new conversations/messages updates
    const interval = setInterval(() => {
      dispatch(getConversations());
    }, 5000); // Poll every 5 seconds for list

    return () => clearInterval(interval);
  }, [dispatch]);

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Messages</h1>

      {Array.isArray(conversations) && conversations.length > 0 ? (
        <div className="space-y-4">
          {conversations.map((conversation) => (
            <MessageItem
              key={conversation?.user?._id || conversation?._id}
              conversation={conversation}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 glass rounded-xl">
          <FaComments className="text-green-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Messages Yet</h3>
          <p className="text-gray-600">
            You don't have any conversations yet. Start messaging to begin a chat.
          </p>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
