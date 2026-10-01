import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";

import type {
  CreateGuestDto,
  Guest,
  GuestGender,
  GuestIdType,
  UpdateGuestDto,
} from "../types/guest.types";

interface GuestFormModalProps {
  isOpen: boolean;
  guest: Guest | null;
  onClose: () => void;
  onSubmit: (
    data: CreateGuestDto | UpdateGuestDto,
    guestId?: string
  ) => Promise<void>;
}

const GuestFormModal = ({
  isOpen,
  guest,
  onClose,
  onSubmit,
}: GuestFormModalProps) => {
  const isEditMode = guest !== null;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [idType, setIdType] = useState<GuestIdType | "">("");
  const [idNumber, setIdNumber] = useState("");

  const [nationality, setNationality] = useState("");
  const [gender, setGender] = useState<GuestGender | "">("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");

  const [company, setCompany] = useState("");
  const [notes, setNotes] = useState("");

  const [vip, setVip] = useState(false);
  const [blacklisted, setBlacklisted] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (guest) {
      setFirstName(guest.firstName);
      setLastName(guest.lastName);
      setEmail(guest.email || "");
      setPhone(guest.phone);

      setIdType(guest.idType || "");
      setIdNumber(guest.idNumber || "");

      setNationality(guest.nationality || "");
      setGender(guest.gender || "");

      if (guest.dateOfBirth) {
        const date = new Date(guest.dateOfBirth);

        if (!Number.isNaN(date.getTime())) {
          setDateOfBirth(date.toISOString().split("T")[0]);
        } else {
          setDateOfBirth("");
        }
      } else {
        setDateOfBirth("");
      }

      setAddress(guest.address || "");
      setCity(guest.city || "");
      setCountry(guest.country || "");

      setEmergencyName(guest.emergencyName || "");
      setEmergencyPhone(guest.emergencyPhone || "");

      setCompany(guest.company || "");
      setNotes(guest.notes || "");

      setVip(guest.vip);
      setBlacklisted(guest.blacklisted);
    } else {
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");

      setIdType("");
      setIdNumber("");

      setNationality("");
      setGender("");
      setDateOfBirth("");

      setAddress("");
      setCity("");
      setCountry("");

      setEmergencyName("");
      setEmergencyPhone("");

      setCompany("");
      setNotes("");

      setVip(false);
      setBlacklisted(false);
    }

    setError("");
  }, [isOpen, guest]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!firstName.trim()) {
      setError("First name is required.");
      return;
    }

    if (!lastName.trim()) {
      setError("Last name is required.");
      return;
    }

    if (!phone.trim()) {
      setError("Phone number is required.");
      return;
    }

    const commonData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim() || undefined,
      phone: phone.trim(),
      idType: idType || undefined,
      idNumber: idNumber.trim() || undefined,
      nationality: nationality.trim() || undefined,
      gender: gender || undefined,
      dateOfBirth: dateOfBirth || undefined,
      address: address.trim() || undefined,
      city: city.trim() || undefined,
      country: country.trim() || undefined,
      emergencyName: emergencyName.trim() || undefined,
      emergencyPhone: emergencyPhone.trim() || undefined,
      company: company.trim() || undefined,
      notes: notes.trim() || undefined,
      vip,
      blacklisted,
    };

    setIsSubmitting(true);

    try {
      if (isEditMode && guest) {
        const updateData: UpdateGuestDto = commonData;

        await onSubmit(updateData, guest.id);
      } else {
        const createData: CreateGuestDto = {
          ...commonData,
        };

        await onSubmit(createData);
      }

      onClose();
    } catch (submitError) {
      if (submitError instanceof Error) {
        setError(submitError.message);
      } else {
        setError("Failed to save guest. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {isEditMode ? "Edit Guest" : "Add Guest"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {isEditMode
                ? "Update guest information."
                : "Create a new guest profile."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto"
        >
          <div className="space-y-6 p-6">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <section>
              <h3 className="text-sm font-semibold text-slate-900">
                Basic Information
              </h3>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    First Name *
                  </label>

                  <input
                    type="text"
                    value={firstName}
                    onChange={(event) =>
                      setFirstName(event.target.value)
                    }
                    required
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Last Name *
                  </label>

                  <input
                    type="text"
                    value={lastName}
                    onChange={(event) =>
                      setLastName(event.target.value)
                    }
                    required
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Phone *
                  </label>

                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) =>
                      setPhone(event.target.value)
                    }
                    placeholder="+254..."
                    required
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  />
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-semibold text-slate-900">
                Identification
              </h3>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    ID Type
                  </label>

                  <select
                    value={idType}
                    onChange={(event) =>
                      setIdType(
                        event.target.value as GuestIdType | ""
                      )
                    }
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  >
                    <option value="">Select ID type</option>
                    <option value="NATIONAL_ID">
                      National ID
                    </option>
                    <option value="PASSPORT">
                      Passport
                    </option>
                    <option value="DRIVERS_LICENSE">
                      Driver's License
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    ID Number
                  </label>

                  <input
                    type="text"
                    value={idNumber}
                    onChange={(event) =>
                      setIdNumber(event.target.value)
                    }
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Nationality
                  </label>

                  <input
                    type="text"
                    value={nationality}
                    onChange={(event) =>
                      setNationality(event.target.value)
                    }
                    placeholder="e.g. Kenyan"
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Gender
                  </label>

                  <select
                    value={gender}
                    onChange={(event) =>
                      setGender(
                        event.target.value as GuestGender | ""
                      )
                    }
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  >
                    <option value="">Select gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Date of Birth
                  </label>

                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(event) =>
                      setDateOfBirth(event.target.value)
                    }
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  />
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-semibold text-slate-900">
                Address
              </h3>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="md:col-span-3">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Address
                  </label>

                  <input
                    type="text"
                    value={address}
                    onChange={(event) =>
                      setAddress(event.target.value)
                    }
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    City
                  </label>

                  <input
                    type="text"
                    value={city}
                    onChange={(event) =>
                      setCity(event.target.value)
                    }
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Country
                  </label>

                  <input
                    type="text"
                    value={country}
                    onChange={(event) =>
                      setCountry(event.target.value)
                    }
                    placeholder="e.g. Kenya"
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  />
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-semibold text-slate-900">
                Emergency Contact
              </h3>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Contact Name
                  </label>

                  <input
                    type="text"
                    value={emergencyName}
                    onChange={(event) =>
                      setEmergencyName(event.target.value)
                    }
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Contact Phone
                  </label>

                  <input
                    type="tel"
                    value={emergencyPhone}
                    onChange={(event) =>
                      setEmergencyPhone(event.target.value)
                    }
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  />
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-semibold text-slate-900">
                Additional Information
              </h3>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Company
                  </label>

                  <input
                    type="text"
                    value={company}
                    onChange={(event) =>
                      setCompany(event.target.value)
                    }
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Notes
                  </label>

                  <textarea
                    value={notes}
                    onChange={(event) =>
                      setNotes(event.target.value)
                    }
                    rows={3}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-3">
                    <input
                      type="checkbox"
                      checked={vip}
                      onChange={(event) =>
                        setVip(event.target.checked)
                      }
                      className="h-4 w-4 rounded border-slate-300"
                    />

                    <span>
                      <span className="block text-sm font-medium text-slate-800">
                        VIP Guest
                      </span>

                      <span className="block text-xs text-slate-500">
                        Mark this guest as VIP.
                      </span>
                    </span>
                  </label>

                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-3">
                    <input
                      type="checkbox"
                      checked={blacklisted}
                      onChange={(event) =>
                        setBlacklisted(event.target.checked)
                      }
                      className="h-4 w-4 rounded border-slate-300"
                    />

                    <span>
                      <span className="block text-sm font-medium text-slate-800">
                        Blacklisted
                      </span>

                      <span className="block text-xs text-slate-500">
                        Flag this guest for attention.
                      </span>
                    </span>
                  </label>
                </div>
              </div>
            </section>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="h-4 w-4" />

              {isSubmitting
                ? "Saving..."
                : isEditMode
                  ? "Save Changes"
                  : "Create Guest"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GuestFormModal;