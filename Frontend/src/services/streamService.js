import api from "../interceptor/authInterceptor";

const createStream = async (streamData) => {
  try {
    const response = await api.post("/streams", streamData);
    return response.data;
  } catch (error) {
    console.error("Error creating stream:", error);
    throw error;
  }
};

const getStream = async (streamId) => {
  try {
    const response = await api.get(`/streams/${streamId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting stream:", error);
    throw error;
  }
};

const endStream = async (streamId) => {
  try {
    const response = await api.put(`/streams/${streamId}/end`);
    return response.data;
  } catch (error) {
    console.error("Error ending stream:", error);
    throw error;
  }
};

const getInstructorStreams = async (instructorId) => {
  try {
    const response = await api.get(`/streams/instructor/${instructorId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting instructor streams:", error);
    throw error;
  }
};

const getCourseStreams = async (courseId) => {
  try {
    const response = await api.get(`/streams/course/${courseId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting course streams:", error);
    throw error;
  }
};

const sendStreamMessage = async (streamId, message) => {
  try {
    const response = await api.post(`/streams/${streamId}/messages`, {
      message,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending stream message:", error);
    throw error;
  }
};

const getStreamMessages = async (streamId) => {
  try {
    const response = await api.get(`/streams/${streamId}/messages`);
    return response.data;
  } catch (error) {
    console.error("Error getting stream messages:", error);
    throw error;
  }
};

export const streamService = {
  createStream,
  getStream,
  endStream,
  getInstructorStreams,
  getCourseStreams,
  sendStreamMessage,
  getStreamMessages,
};
