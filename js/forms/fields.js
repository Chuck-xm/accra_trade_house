export const input = (
  label,
  name,
  type = "text",
  placeholder = "",
  required = true,
) =>
  /* HTML */ `<label
    >${label}<input
      name="${name}"
      type="${type}"
      placeholder="${placeholder}"
      ${required ? "required" : ""}
      maxlength="200"
  /></label>`;
export const textarea = (label, name, placeholder) =>
  /* HTML */ `<label
    >${label}<textarea
      name="${name}"
      placeholder="${placeholder}"
      maxlength="2000"
      required
    ></textarea>
  </label>`;
export const demoNote =
  '<p class="form-note">Prototype: this form saves a demo record in this browser only. Nothing is sent to the Trade House. Please use sample contact details.</p>';
export function formShell(
  title,
  description,
  type,
  fields,
  button = "Save demo request",
  extra = "",
) {
  return /* HTML */ `<div class="modal-eyebrow">ACCRA TRADE HOUSE</div>
    <h2 id="dialog-title" class="modal-title">${title}</h2>
    <p class="modal-description">${description}</p>
    <form class="modal-form" data-form="${type}">
      ${extra}${fields}${demoNote}<button class="button dark" type="submit">
        ${button}
      </button>
    </form>`;
}
