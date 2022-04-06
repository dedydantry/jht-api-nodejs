import Article from "../models/mongo/Article.mjs";
import { Validator } from "node-input-validator";
import { errorValidations } from "../helpers/index.mjs";

const ArticleController = {
  async index(req, res) {
    try {
      let skip = 0;
      let limit = 15;
      const page = req.query.page ? req.query.page : 1;
      skip = page === 1 ? 0 : (page - 1) * 15;
      let articles = Article.find({})
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit);
      articles = await articles;
      const totalArticle = await Article.count();
      let totalPage = totalArticle / 15;
      const result = {
        total_page:
          totalPage > parseInt(totalPage)
            ? parseInt(totalPage) + 1
            : parseInt(totalPage),
        total: totalArticle,
        last_page: parseInt(page),
        data: articles,
      };

      res.send({
        status: true,
        data: result,
      });
    } catch (error) {
      res.send({
        status: false,
        message: error.message,
      });
    }
  },

  async store(req, res) {
    try {
      const validate = new Validator(req.body, {
        title: "required|string",
        cover: "required|string",
        content: "required",
        admin: "required|object",
        meta: "required|object",
      });

      const matched = await validate.check();
      if (!matched)
        return res.send({
          status: false,
          message: errorValidations(validate.errors),
        });

      const admin = req.body.admin ? JSON.parse(req.body.admin) : null;
      const meta = req.body.meta ? JSON.parse(req.body.meta) : null;

      const articles = await new Article({
        title: req.body.title,
        cover: req.body.cover,
        content: req.body.content,
        admin: admin,
        published_at: req.body.published_at,
        meta: meta,
      });
      articles.save();

      res.send({
        status: true,
        message: articles,
      });
    } catch (error) {
      res.send({
        status: false,
        message: error.message,
      });
    }
  },

  async show(req, res) {
    try {
      const article = await Article.findById(req.params.id);
      res.send({
        status: true,
        data: article,
      });
    } catch (error) {
      res.send({
        status: false,
        message: error.message,
      });
    }
  },

  async update(req, res) {
    try {
      const validate = new Validator(req.body, {
        title: "required|string",
        cover: "required|string",
        content: "required",
        admin: "required|object",
        meta: "required|object",
      });

      const matched = await validate.check();
      if (!matched)
        return res.send({
          status: false,
          message: errorValidations(validate.errors),
        });

      const articleId = req.params.id;
      const admin = req.body.admin ? JSON.parse(req.body.admin) : null;
      const meta = req.body.meta ? JSON.parse(req.body.meta) : null;

      const params = {
        title: req.body.title,
        cover: req.body.cover,
        content: req.body.content,
        admin: admin,
        published_at: req.body.published_at,
        meta: meta,
      };

      await Article.updateOne({ _id: articleId }, params, { upsert: true });
      res.send({
        status: true,
        message: params,
      });
    } catch (error) {
      return res.send({
        status: false,
        message: error.message,
      });
    }
  },

  async destroy(req, res) {
    try {
      await Article.deleteOne({ _id: req.params.id });
      res.send({
        status: true,
        message: "Article has deleted",
      });
    } catch (error) {
      res.send({
        status: false,
        message: error.message,
      });
    }
  },
};

export default ArticleController;
