import { useLoaderData, useNavigate } from 'react-router-dom';
import { User, updateUser } from '../util/api';
import {
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { TextInputWithLabel } from '../components/TextInputWithLabel';
import { Button, Label, Textarea } from 'flowbite-react';
import { Value } from '../util/events';
import { canEdit } from '../util/user';
import { MicrosoftProvider, useOIDCProvider } from '../util/oidc';

function LoadingAnimation() {
  return (
    <>
      <div className="max-w-xl h-12 mt-1 animate-pulse dark:bg-gray-600 bg-zinc-100 rounded" />
      {Array(5)
        .fill(0)
        .map(() => (
          <>
            <div className="max-w-lg h-8 mt-1 animate-pulse dark:bg-gray-600 bg-zinc-100 rounded" />
            <div className="max-w-md h-8 mt-1 animate-pulse dark:bg-gray-600 bg-zinc-100 rounded" />
          </>
        ))}
    </>
  );
}

function AccessDenied() {
  return (
    <>
      <h1 className="text-3xl">Access Denied</h1>
      <p>You are now allowed to edit this user.</p>
    </>
  );
}

function CannotBeModifiedHelperText() {
  return (
    <>
      This cannot be modified here. Please do so on
      <a
        href="https://id.realliance.net/if/user/#/settings"
        className="ml-1 font-medium text-cyan-600 hover:underline dark:text-cyan-500"
      >
        Realliance ID
      </a>
      .
    </>
  );
}

interface EventTargets {
  description: Value<string>;
  pronouns: Value<string>;
}

export function UserUpdate() {
  const { loading, profile, token } = useContext(AuthContext);
  const { beginFlow: beginMsFlow } = useOIDCProvider(MicrosoftProvider);
  const user = useLoaderData() as User;
  const navigate = useNavigate();

  const [description, setDescription] = useState<string | undefined>(undefined);
  const [pronouns, setPronouns] = useState<string | undefined>(undefined);

  const allowUserEdit = canEdit(profile, user?.username);

  useEffect(() => {
    if (description === undefined && user.description) {
      setDescription(user.description ?? '');
    }
  }, [description, user.description]);

  useEffect(() => {
    if (pronouns === undefined && user.pronouns) {
      setPronouns(user.pronouns ?? '');
    }
  }, [pronouns, user.pronouns]);

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (token) {
        const eventTargets = e.target as unknown as EventTargets;
        const description = eventTargets.description.value;
        const pronouns = eventTargets.pronouns.value;

        const { error } = await updateUser(token, user.username, {
          description,
          pronouns,
        });
        if (error) {
          console.error(error);
          return;
        } else {
          navigate(`/user/${user.username}`);
        }
      }
    },
    [token, navigate, user.username],
  );

  const userForm = useMemo(
    () => (
      <>
        <h1 className="text-3xl">Edit {user.displayName}</h1>
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <TextInputWithLabel
            id="username"
            name="Username"
            value={user.username}
            disabled={true}
            helperText={<CannotBeModifiedHelperText />}
          />
          <TextInputWithLabel
            id="displayName"
            name="Display Name"
            value={user.displayName}
            disabled={true}
            helperText={<CannotBeModifiedHelperText />}
          />
          <TextInputWithLabel
            id="pronouns"
            name="Pronouns"
            placeholder="they/them"
            value={pronouns}
            onChange={setPronouns}
          />
          <div>
            <div className="mb-2 block">
              <Label htmlFor="description" value="Description" />
            </div>
            <Textarea
              id="description"
              required
              placeholder="Talk about yourself!"
              value={description ?? ''}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <Button type="submit" outline>
            Save
          </Button>
        </form>
      </>
    ),
    [user, onSubmit, description, setDescription, pronouns],
  );

  const content = useMemo(
    () =>
      loading ? (
        <LoadingAnimation />
      ) : allowUserEdit ? (
        userForm
      ) : (
        <AccessDenied />
      ),
    [loading, allowUserEdit, userForm],
  );

  return (
    <div className="container max-w-2xl mx-auto flex flex-col gap-3">
      {content}
      <hr />
      <h1 className="text-2xl">Connections</h1>
      <Button onClick={() => beginMsFlow()}>Connect Minecraft</Button>
    </div>
  );
}
