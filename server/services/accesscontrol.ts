import { AccessControl } from "accesscontrol";

let grantsObject = {
  user: {
    chats: {
      "create:own": ["*"],
      "read:own": ["*"],
      "delete:own": ["*"],
      "update:any": ["*"],
      "read:any": [
        "*",
        "!members",
        "!member_ids",
        "!last_message",
        "!chat_owner_id",
      ],
    },
    messages: {
      "create:own": ["*"],
      "read:own": ["*"],
    },
  },
};

const ac = new AccessControl(grantsObject);

ac.lock();

export default ac;
