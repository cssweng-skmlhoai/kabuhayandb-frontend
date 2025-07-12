import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import ClearableInputField from "@/components/MemberCompts/ClearableInputField";
import ClearableSelectField from "@/components/MemberCompts/ClearableSelectField";
import CheckboxField from "@/components/MemberCompts/CheckboxField";
import ConfirmDialog from "@/components/MemberCompts/ConfirmDialog";
import axios from "axios";
import "./Members.css";

const HousingUtilities = ({ view }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [savedData, setSavedData] = useState(null);
  const isEdit = view === "edit";

  const form = useForm({
    defaultValues: {
      tct_no: "",
      block_no: "",
      lot_no: "",
      area: "",
      open_space_share: "",
      total: "",
      confirmity_signature: "",
      remarks: "",
      Meralco: 0,
      Maynilad: 0,
      Septic_Tank: 0,
      condition_type: "",
      land_acquisition: "",
      status_of_occupancy: "",
    },
  });

  const API_SECRET = import.meta.env.VITE_API_SECRET;
  const API_URL = "https://kabuhayandb-backend.onrender.com";

  useEffect(() => {
    axios
      .get(`${API_URL}/members/info/${id}`, {
        headers: {
          Authorization: `Bearer ${API_SECRET}`,
        },
      })
      .then((res) => {
        const data = res.data;
        const household = {
          tct_no: data.tct_no,
          block_no: data.block_no,
          lot_no: data.lot_no,
          area: data.area || "",
          open_space_share: data.open_space_share,
          total: data.total || "",
          confirmity_signature: data.confirmity_signature || "",
          remarks: data.remarks,
          condition_type: data.condition_type,
          Meralco: data.Meralco,
          Maynilad: data.Maynilad,
          Septic_Tank: data.Septic_Tank,
          land_acquisition: data.land_acquisition,
          status_of_occupancy: data.status_of_occupancy,
        };

        setSavedData(household);
        form.reset(household);
      })
      .catch((err) => console.log(err));
  }, [form, id, API_SECRET]);

  // function to update housing & utilities details
  const handleUpdates = async (data) => {
    const payload = {
      members: {
        //confirmity_signature: data.confirmity_signature,
        remarks: data.remarks,
      },
      families: {},
      households: {
        tct_no: data.tct_no,
        block_no: data.block_no,
        lot_no: data.lot_no,
        //area: data.area,
        open_space_share: data.open_space_share,
        //total: data.total,
        condition_type: data.condition_type,
        Meralco: data.Meralco,
        Maynilad: data.Maynilad,
        Septic_Tank: data.Septic_Tank,
        //land_acquisition: data.land_acquisition,
        //status_of_occupancy: data.status_of_occupancy,
      },
      family_members: [],
    };

    try {
      await axios.put(`${API_URL}/members/info/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${API_SECRET}`,
        },
      });

      setSavedData(data);
      navigate(`/memberView/${id}/housing-utilities`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="main">
      <div className="btn-div">
        {isEdit ? (
          <>
            <Button
              variant="cancel"
              onClick={() => {
                if (savedData) {
                  form.reset(savedData);
                }
                navigate(`/memberView/${id}/housing-utilities`);
              }}
            >
              Cancel
            </Button>
            <ConfirmDialog
              title="Save Changes"
              description="Are you sure you want to save these changes?"
              triggerLabel="Save Details"
              onConfirm={form.handleSubmit(handleUpdates)}
              variant="edit_details"
            />
          </>
        ) : (
          <Button
            variant="edit_details"
            onClick={() => navigate(`/memberView/${id}/housing-utilities/edit`)}
          >
            {" "}
            Edit Details{" "}
          </Button>
        )}
      </div>

      <Form {...form}>
        <div className="info">
          <Card className="card">
            <CardContent className="card-content">
              <div className="space-y-4 mt-4 grid gap-4 sm:grid-cols-2">
                <ClearableInputField
                  control={form.control}
                  name="tct_no"
                  label="TCT No."
                  isEdit={isEdit}
                />

                <div className="flex gap-4">
                  <ClearableInputField
                    control={form.control}
                    name="block_no"
                    label="Block No."
                    className="w-1/2"
                    isEdit={isEdit}
                  />
                  <ClearableInputField
                    control={form.control}
                    name="lot_no"
                    label="Lot No."
                    className="w-1/2"
                    isEdit={isEdit}
                  />
                </div>

                <div className="flex gap-4">
                  <ClearableInputField
                    control={form.control}
                    name="area"
                    label="Area"
                    className="w-1/2"
                    isEdit={isEdit}
                  />
                  <ClearableInputField
                    control={form.control}
                    name="open_space_share"
                    label="Share of Open Space"
                    className="w-1/2"
                    isEdit={isEdit}
                  />
                </div>

                <ClearableInputField
                  control={form.control}
                  name="total"
                  label="Total"
                  isEdit={false}
                  inputProps={{ readOnly: true }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="card">
            <CardContent className="card-content">
              <div className="space-y-4 mt-4 grid gap-4 sm:grid-cols-2">
                <ClearableInputField
                  control={form.control}
                  name="confirmity_signature"
                  label="Conformity/ Signature"
                  isEdit={isEdit}
                />
                <ClearableInputField
                  control={form.control}
                  name="remarks"
                  label="Remarks"
                  isEdit={isEdit}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="card">
            <CardContent className="card-content space-y-4">
              <ClearableSelectField
                control={form.control}
                name="condition_type"
                label="Housing Condition/ Types"
                isEdit={isEdit}
                options={[
                  "Needs minor repair",
                  "Needs major repair",
                  "Dilapidated/Condemned",
                  "Under renovation/Being repaired",
                  "Unfinished construction",
                  "Under construction",
                ]}
              />

              <div className="flex gap-6">
                <CheckboxField
                  control={form.control}
                  name="Meralco"
                  label="Meralco"
                  isEdit={isEdit}
                />
                <CheckboxField
                  control={form.control}
                  name="Maynilad"
                  label="Maynilad"
                  isEdit={isEdit}
                />
                <CheckboxField
                  control={form.control}
                  name="Septic_Tank"
                  label="Septic Tank"
                  isEdit={isEdit}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <ClearableSelectField
                  control={form.control}
                  name="land_acquisition"
                  label="Land Acquisition"
                  isEdit={false}
                  options={[
                    "CMP",
                    "Direct Buying",
                    "On Process",
                    "Auction",
                    "Organized Community",
                    "Expropriation",
                  ]}
                />
                <ClearableSelectField
                  control={form.control}
                  name="status_of_occupancy"
                  label="Status of Occupancy"
                  isEdit={false}
                  options={["Owner", "Sharer", "Renter"]}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </Form>
    </div>
  );
};

export default HousingUtilities;
