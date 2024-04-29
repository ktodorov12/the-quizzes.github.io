import { html } from "@lit-html/lit-html.js";
import { deleteData, getAllDataForOneItem, getAllParticipationsForQuiz, getUserById } from "@src/data/data.js";
import { updateTopic } from "@src/data/dataUpdate.js";
import { isOwner } from "@src/util.js";
import { navigationTemplate } from "@src/views/navigation.js";
import { profileQuizResultsTbody, quizCard } from "@src/views/partials.js";

/**
 * 
 * @param {import("@src/types").PageContext} ctx 
 * @param {Object} creatorData - user data for the creator of the showed quizzes in the profile
 * @param {Boolean} currUserIsOwner - checks whether the curr user is the creator of the quizzes in the profile
 * @param {Object} participatedQuizzes - all of the participated quizzes for the user
 * @param {Object} createdQuizzes - all of the quizzes that the user has created  
 * @param {Function} onDelete 
 * @returns 
 */
function profileTemplate(ctx, creatorData, currUserIsOwner, participatedQuizzes, createdQuizzes, onDelete) {
  return html` 
  ${navigationTemplate(ctx)}
  <section id="profile">
    <header class="pad-large">
      <h1>Profile Page</h1>
    </header>
    <div class="hero pad-large">
  <article class="glass pad-large profile">
    <h2>Profile Details</h2>
    <p>
      <span class="profile-info">Username:</span>
      ${creatorData.username}
    </p>
    <p>
      <span class="profile-info">Email:</span>
      ${creatorData.email}
    </p>
    <h2>${currUserIsOwner ? "Your" : creatorData.username} Quiz Results</h2>
    <table class="quiz-results">
        ${participatedQuizzes.map(profileQuizResultsTbody)}
    </table>
  </article>
</div>

    <header class="pad-large">
      <h2>Quizes created by ${currUserIsOwner ? "you" : creatorData.username}</h2>
    </header>

    <div class="pad-large alt-page">
      ${createdQuizzes.length > 0
        ? createdQuizzes.map((quiz, i) => quizCard(quiz, currUserIsOwner, true, onDelete))
        : currUserIsOwner
            ? html`<a class="action cta" href="/create">Create quiz</a>` 
            : null
      }
    </div>
  </section>`;
}

/**
 *
 * @param {import("@src/types").PageContext} ctx
 */
export async function showProfile(ctx) {
    // @ts-ignore
    const id = ctx.params.id;
    const currUserIsOwner = isOwner(id);

    const creatorData = await getUserById(id);
    const participatedQuizzes = await getAllDataForOneItem("quizResults", id, "participatedUser", "_User");
    const creatorQuizzes = await getAllDataForOneItem("quizzes", creatorData.objectId, "ownerId", "_User");
    const updatedQuizzes = await updateTopic(creatorQuizzes);
    
    ctx.render(profileTemplate(ctx, creatorData, currUserIsOwner, participatedQuizzes.results, updatedQuizzes, onDelete));

    async function onDelete(e) {
      const agree = confirm("Do you want to delete this quiz?");
      if (!agree) return
      
      e.currentTarget.disabled = true;
      const quizName = e.currentTarget.parentElement.parentElement.querySelector("h3 a").textContent;

      const quiz = updatedQuizzes.find(q => q.title == quizName);
      const questions = await getAllDataForOneItem("questions", quiz.objectId, "quizId", "quizzes");
      const participated = await getAllParticipationsForQuiz(quiz.objectId);
      
      await deleteData("quizzes", quiz.objectId);
      deleterer("questions", questions); 
      if (participated.results.length > 0) {
        deleterer("quizResults", participated);
      }

      ctx.page.redirect(`/profile/${id}`)
    }
}

function deleterer(className, data) {
  data.results.forEach(async (d) => {
    await deleteData(className, d.objectId);
  })
}
