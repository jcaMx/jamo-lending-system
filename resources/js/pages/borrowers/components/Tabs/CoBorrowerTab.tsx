type CoBorrowerType = {
  id?: number;
  ID?: number;
  name?: string;
  first_name?: string;
  last_name?: string;
  relation?: string;
  age?: number;
  email?: string;
  contact_no?: string;
  occupation?: string;
  position?: string;
  agency_address?: string;
  marital_status?: string;
  home_ownership?: string;
};

interface Props {
  borrower: {
    coBorrowers?: CoBorrowerType[];
  };
}

export default function CoBorrowerTab({ borrower }: Props) {
  const list = borrower.coBorrowers ?? [];

  if (!list.length) {
    return <p className="p-4 text-gray-500">No co-borrowers found.</p>;
  }

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {list.map((c) => {
        const id = c.ID ?? c.id ?? `${c.first_name}-${c.last_name}`;
        const fullName = c.name ?? `${c.first_name ?? ''} ${c.last_name ?? ''}`.trim();
        return (
          <div key={id} className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200">
            <div className="font-semibold text-lg">{fullName || 'Unnamed Co-Borrower'}</div>
            <div className="text-sm text-gray-600 mt-2 space-y-1">
              {c.age && (
                <p>
                  <span className="font-medium">Age:</span> {c.age}
                </p>
              )}
              {c.occupation && (
                <p>
                  <span className="font-medium">Occupation:</span> {c.occupation}
                </p>
              )}
              {c.position && (
                <p>
                  <span className="font-medium">Position:</span> {c.position}
                </p>
              )}
              {c.email && (
                <p>
                  <span className="font-medium">Email:</span> {c.email}
                </p>
              )}
              {c.contact_no && (
                <p>
                  <span className="font-medium">Mobile:</span> {c.contact_no}
                </p>
              )}
              {c.agency_address && (
                <p>
                  <span className="font-medium">Agency:</span> {c.agency_address}
                </p>
              )}
              {c.marital_status && (
                <p>
                  <span className="font-medium">Marital Status:</span> {c.marital_status}
                </p>
              )}
              {c.home_ownership && (
                <p>
                  <span className="font-medium">Home Ownership:</span> {c.home_ownership}
                </p>
              )}
              {c.relation && (
                <p>
                  <span className="font-medium">Relation:</span> {c.relation}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}