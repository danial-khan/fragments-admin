import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faKey } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import apiFetch from "../../utils/axios";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

const CreateUserModal = ({
  isOpen,
  onClose,
  onCreated,
}: CreateUserModalProps) => {
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const generatePassword = () => {
    const generated = Math.random().toString(36).slice(-10);
    setNewUser({ ...newUser, password: generated });
    toast.info("Password generated");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await apiFetch.post("/admin/register", newUser);
      toast.success("Moderator created successfully!");
      if (onCreated) onCreated();
      else onClose();
      setNewUser({ name: "", email: "", password: "" });
    } catch {
      toast.error("Error creating user.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-opacity-50 z-50 flex justify-center items-start overflow-y-auto"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-secondary">Create New Moderator</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={newUser.name}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={newUser.email}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="password"
                name="password"
                value={newUser.password}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter or generate password"
                required
              />
              <button
                type="button"
                onClick={generatePassword}
                className="bg-gray-200 hover:bg-gray-300 text-sm px-3 rounded flex items-center"
                title="Generate Password"
              >
                <FontAwesomeIcon icon={faKey} className="w-4 h-4 text-secondary" />
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-accent text-white rounded hover:bg-secondary disabled:opacity-50"
            >
              {isLoading ? "Creating..." : "Create Moderator"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
