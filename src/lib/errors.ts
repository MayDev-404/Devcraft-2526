// Maps the coded exceptions raised by our Postgres RPCs to friendly messages.
const MAP: Record<string, string> = {
  NOT_AUTHENTICATED: "Please log in again.",
  TEAM_NAME_REQUIRED: "Please enter a team name.",
  ALREADY_ON_TEAM: "You're already on a team. Leave it first to switch.",
  TEAM_NOT_FOUND: "No team found with that ID. Double-check and try again.",
  TEAM_FULL: "That team is already full (max 4 members).",
  NOT_ON_TEAM: "You're not on a team.",
  LEADER_MUST_TRANSFER:
    "As leader, transfer leadership or remove members before leaving.",
  NOT_TEAM_LEADER_OR_MEMBER: "You can't manage that member.",
  CANNOT_REMOVE_SELF: "You can't remove yourself — use 'Leave team' instead.",
  TEAM_TOO_SMALL:
    "Your team needs at least 2 members before you can submit.",
  SUBMISSIONS_CLOSED: "Submissions are currently closed.",
  TITLE_REQUIRED: "Please add a project title.",
  DESCRIPTION_REQUIRED: "Please add a project description.",
  INVALID_REPO_URL: "Enter a valid repository URL (must start with https://).",
  INVALID_DEMO_URL: "Enter a valid demo URL (must start with https://) or leave it blank.",
};

export function rpcErrorMessage(raw: string | undefined): string {
  if (!raw) return "Something went wrong. Please try again.";
  for (const code of Object.keys(MAP)) {
    if (raw.includes(code)) return MAP[code];
  }
  return raw;
}
